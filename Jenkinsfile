pipeline {
  agent any
  tools {nodejs "nodejs-12"}
  stages {
    stage('Build') {
      steps {
        sh 'node --version'
        sh 'npm --version'
        sh 'npm install'
        script {
          scriptModule = load 'scripts/Upload.Groovy'
        }
      }
    }
    stage('Test') {
      steps {
        sh 'echo test-step'
      }
    }
    stage('Analysis') {
      steps {
        sh 'echo analysis-step'
      }
    }
    stage('Deploy to Staging') {
      when { branch 'master' }
      steps {
        sh 'npm run build-staging'
        script {
          scriptModule.uploadToGCB('gs://staging.nftcomposer.tracified.com')
        }

      }
    }
     stage('Deploy to QA') {
      when { branch 'master' }
      steps {
        sh 'npm run build-qa'
        script {
          scriptModule.uploadToGCB('gs://qa.nftcomposer.tracified.com')
        }
      }
    }
  }
  post {
    always {
      echo 'Process finished'
      discordSend(
        description: "Tracified NFT Composer frontend - ${currentBuild.currentResult}",
        footer: "#${env.BUILD_ID} ${currentBuild.getBuildCauses()[0].shortDescription}",
        link: env.BUILD_URL,
        result: currentBuild.currentResult,
        title: JOB_NAME,
        webhookURL: env.DISCORD_BUILD
      )
      deleteDir()
    }
  }
}
