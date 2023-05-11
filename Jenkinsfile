pipeline {
  agent any
  tools {nodejs "nodejs-12"}
  stages {
    stage('Build') {
      steps {
        sh 'node --version'
        sh 'npm --version'
        sh 'npm install'
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
        s3Upload(
          consoleLogLevel: 'INFO',
          dontWaitForConcurrentBuildCompletion: false,
          entries: [[
            bucket: 'staging.nftcomposer.tracified.com',
            excludedFile: '',
            flatten: false,
            gzipFiles: false,
            keepForever: false,
            managedArtifacts: false,
            noUploadOnFailure: true,
            selectedRegion: 'ap-south-1',
            showDirectlyInBrowser: false,
            sourceFile: 'dist/tracified-nft-composer-frontend/**',
            storageClass: 'STANDARD',
            uploadFromSlave: false,
            useServerSideEncryption: false
          ]],
          pluginFailureResultConstraint: 'FAILURE',
          profileName: 'tracified-admin-frontend-jenkins-deployer',
          userMetadata: [],
          dontSetBuildResultOnFailure: false
        )

      }
    }
     stage('Deploy to QA') {
      when { branch 'master' }
      steps {
        sh 'npm run build-qa'
        s3Upload(
          consoleLogLevel: 'INFO',
          dontWaitForConcurrentBuildCompletion: false,
          entries: [[
            bucket: 'qa.nftcomposer.tracified.com',
            excludedFile: '',
            flatten: false,
            gzipFiles: false,
            keepForever: false,
            managedArtifacts: false,
            noUploadOnFailure: true,
            selectedRegion: 'ap-south-1',
            showDirectlyInBrowser: false,
            sourceFile: 'dist/tracified-nft-composer-frontend/**',
            storageClass: 'STANDARD',
            uploadFromSlave: false,
            useServerSideEncryption: false
          ]],
          pluginFailureResultConstraint: 'FAILURE',
          profileName: 'tracified-admin-frontend-jenkins-deployer',
          userMetadata: [],
          dontSetBuildResultOnFailure: false
        )
      }
    }
    stage('Deploy to Production') {
      when { branch 'master' }
      steps {
        s3Upload(
          consoleLogLevel: 'INFO',
          dontWaitForConcurrentBuildCompletion: false,
          entries: [[
            bucket: 'nftcomposer.tracified.com',
            excludedFile: '',
            flatten: false,
            gzipFiles: false,
            keepForever: false,
            managedArtifacts: false,
            noUploadOnFailure: true,
            selectedRegion: 'ap-south-1',
            showDirectlyInBrowser: false,
            sourceFile: 'dist/tracified-nft-composer-frontend/**',
            storageClass: 'STANDARD',
            uploadFromSlave: false,
            useServerSideEncryption: false
          ]],
          pluginFailureResultConstraint: 'FAILURE',
          profileName: 'tracified-admin-frontend-jenkins-deployer',
          userMetadata: [],
          dontSetBuildResultOnFailure: false
        )
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
