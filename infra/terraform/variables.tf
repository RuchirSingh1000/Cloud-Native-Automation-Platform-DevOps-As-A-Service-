variable "project_name" {
  type    = string
  default = "devops-platform"
}

variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "deployment_target" {
  type    = string
  default = "ec2"
}

variable "ami_id" {
  type    = string
  default = "ami-0c55b159cbfafe1f0"
}

variable "subnet_ids" {
  type    = list(string)
  default = ["subnet-12345678", "subnet-abcdef12"]
}
