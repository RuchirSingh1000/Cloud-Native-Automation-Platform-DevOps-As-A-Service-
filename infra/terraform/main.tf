terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    random = {
      source = "hashicorp/random"
      version = "~> 3.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

resource "aws_s3_bucket" "artifacts" {
  bucket = "${var.project_name}-artifacts-${random_id.suffix.hex}"
}

resource "random_id" "suffix" {
  byte_length = 4
}

resource "aws_iam_role" "ec2_role" {
  name = "${var.project_name}-ec2-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Effect = "Allow",
      Principal = { Service = "ec2.amazonaws.com" },
      Action = "sts:AssumeRole"
    }]
  })
}

module "ec2" {
  source  = "terraform-aws-modules/ec2-instance/aws"
  version = "~> 5.0"

  count         = var.deployment_target == "ec2" ? 1 : 0
  name          = "${var.project_name}-instance"
  instance_type = "t3.micro"
  ami           = var.ami_id
}

resource "aws_eks_cluster" "main" {
  count    = var.deployment_target == "eks" ? 1 : 0
  name     = "${var.project_name}-eks"
  role_arn = aws_iam_role.ec2_role.arn
  vpc_config {
    subnet_ids = var.subnet_ids
  }
}
