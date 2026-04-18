import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { decodeVin, VIN_REGEX } from "@/lib/vin-decoder";
import { z } from "zod";

const VinInput = z.object({
  vin: z.string().trim().min(11).max(17).regex(VIN_REGEX, "VIN không hợp lệ"),
});

// Authenticated user calls this from the dashboard. Logged with user_id.
export const decodeVinForUser = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((d: unknown) => VinInput.parse(d))
  .handler(async ({ data, context }) => {
    const result = await decodeVin(data.vin);
    await supabaseAdmin.from("decode_logs").insert({
      user_id: context.userId,
      vin: result.vin,
      status_code: 200,
      source: result.source,
      result: result as any,
    });
    return result;
  });

// Anonymous public decode (no auth, no API key). Logged anonymously.
export const decodeVinPublic = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => VinInput.parse(d))
  .handler(async ({ data }) => {
    const result = await decodeVin(data.vin);
    await supabaseAdmin.from("decode_logs").insert({
      vin: result.vin,
      status_code: 200,
      source: result.source,
      result: result as any,
    });
    return result;
  });
