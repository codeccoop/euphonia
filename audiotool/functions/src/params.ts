export const maxTaskBatchSize = 450;

export const bucketName =
  process.env.EUPHONIA_STORAGE_BUCKET || "collectivat-euphonia.firebaseio.com";

export const recordingPath =
  process.env.EUPHONIA_STORAGE_RECORDING_PATH || "audioapp_recordings";

export const consentsPath =
  process.env.EUPHONIA_STORAGE_CONSENTS_PATH || "audioapp_consents";

export const imagetasksPath =
  process.env.EUPHONIA_STORAGE_IMAGETAKS_PATH || "audioapp_imagetasks";

export const adminEmails: string[] = (
  process.env.EUPHONIA_ADMIN_EMAILS_LIST || ""
)
  .split(",")
  .map((e) => e.trim());
