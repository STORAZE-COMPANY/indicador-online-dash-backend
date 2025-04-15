export enum s3Buckets {
  INDICADOR_ONLINE_IMAGES = "indicador-online-images",
}

export enum S3Props {
  public_file_permission = "public-read",

  file_limit_5MB = 5 * 1024 * 1024, // 5 MB

  expiries_time_singed_url = 1200, // 20 minutes

  directory = "app-images/questions-answers/",
}
