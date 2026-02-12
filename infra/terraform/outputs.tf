output "artifact_bucket" {
  value = aws_s3_bucket.artifacts.bucket
}

output "deployment_target" {
  value = var.deployment_target
}
