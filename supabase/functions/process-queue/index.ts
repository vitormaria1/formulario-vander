import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const supabaseUrl = Deno.env.get("SUPABASE_URL")!
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
const uazapiToken = Deno.env.get("VITE_UAZAPI_TOKEN")!
const uazapiBaseUrl = Deno.env.get("VITE_UAZAPI_BASE_URL") || "https://varia.uazapi.com"

const supabase = createClient(supabaseUrl, supabaseServiceKey)

function normalizePhoneNumber(phone: string): string {
  if (!phone) return ""
  const digits = phone.replace(/\D/g, "")
  if (digits.startsWith("55") && digits.length >= 12) return digits
  if (digits.length >= 10 && digits.length <= 11) return "55" + digits
  return digits
}

function formatFormMessage(formData: any): string {
  const formatValue = (value: any) => {
    if (!value) return "[Não respondido]"
    return String(value).trim()
  }

  const lines = [
    "📋 RESPOSTAS PRÉ-SESSÃO",
    "",
    `E-mail: ${formatValue(formData.email)}`,
    `Nome: ${formatValue(formData.name)}`,
    `Telefone: ${formatValue(formData.phone)}`,
  ]

  if (formData.age) lines.push(`Idade: ${formatValue(formData.age)}`)
  if (formData.birthDate) lines.push(`Data de nascimento: ${formatValue(formData.birthDate)}`)
  if (formData.address) lines.push(`Endereço: ${formatValue(formData.address)}`)
  if (formData.religion) lines.push(`Religião: ${formatValue(formData.religion)}`)
  if (formData.maritalStatus) lines.push(`Estado civil: ${formatValue(formData.maritalStatus)}`)
  if (formData.profession) lines.push(`Profissão: ${formatValue(formData.profession)}`)
  if (formData.income) lines.push(`Renda: ${formatValue(formData.income)}`)

  lines.push("")
  if (formData.therapyHistory) lines.push(`Histórico de terapia: ${formatValue(formData.therapyHistory)}`)
  if (formData.diagnosis) lines.push(`Diagnósticos: ${formatValue(formData.diagnosis)}`)
  if (formData.medication) lines.push(`Medicações: ${formatValue(formData.medication)}`)
  if (formData.routine) lines.push(`Rotina: ${formatValue(formData.routine)}`)

  lines.push("")
  lines.push(`Motivo da terapia: ${formatValue(formData.reason)}`)
  lines.push("")
  lines.push(`Objetivos (3 meses): ${formatValue(formData.goals)}`)
  if (formData.additional) {
    lines.push("")
    lines.push(`Observações: ${formatValue(formData.additional)}`)
  }

  lines.push("")
  lines.push("---")
  lines.push(`Enviado em: ${new Date().toLocaleString("pt-BR")}`)

  return lines.join("\n")
}

async function sendViaWhatsApp(formData: any, phoneDestination: string) {
  const phoneNormalized = normalizePhoneNumber(phoneDestination)
  const message = formatFormMessage(formData)

  const response = await fetch(`${uazapiBaseUrl}/send/text`, {
    method: "POST",
    headers: {
      token: uazapiToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      number: phoneNormalized,
      text: message,
    }),
  })

  if (!response.ok) {
    const errorData = await response.text()
    throw new Error(`uazAPI error: ${response.status} - ${errorData}`)
  }

  return response.json()
}

async function processQueue() {
  console.log("[Queue Processor] Iniciando processamento...")

  try {
    const { data: items, error } = await supabase
      .from("submission_queue")
      .select("*")
      .eq("status", "pending")
      .order("created_at", { ascending: true })
      .limit(10)

    if (error) throw error

    console.log(`[Queue] ${items?.length || 0} itens pendentes`)

    for (const item of items || []) {
      try {
        console.log(`[Queue] Processando item ${item.id}...`)

        await sendViaWhatsApp(item.form_data, item.phone_destination)

        await supabase
          .from("submission_queue")
          .update({
            status: "processed",
            attempts: item.attempts + 1,
            processed_at: new Date().toISOString(),
          })
          .eq("id", item.id)

        console.log(`[Queue] ✅ Item ${item.id} processado`)
      } catch (error) {
        const newAttempts = item.attempts + 1
        const maxAttempts = 5
        const newStatus = newAttempts >= maxAttempts ? "failed" : "pending"

        await supabase
          .from("submission_queue")
          .update({
            status: newStatus,
            attempts: newAttempts,
            error_message: error instanceof Error ? error.message : String(error),
            last_error_at: new Date().toISOString(),
          })
          .eq("id", item.id)

        if (newStatus === "failed") {
          console.error(`[Queue] ❌ Item ${item.id} falhou após ${maxAttempts} tentativas`)
        } else {
          console.log(`[Queue] ⏳ Item ${item.id} retry (tentativa ${newAttempts}/${maxAttempts})`)
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
    }

    console.log("[Queue] ✅ Processamento concluído")
    return new Response(JSON.stringify({ success: true, processed: items?.length || 0 }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error) {
    console.error("[Queue] Erro:", error)
    return new Response(JSON.stringify({ error: error instanceof Error ? error.message : String(error) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}

serve(async (req) => {
  if (req.method === "POST") {
    return await processQueue()
  }
  return new Response("Queue Processor - POST to process", { status: 200 })
})
