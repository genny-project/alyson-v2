pipeline {
	agent any
	stages {
		stage ('Clone') {
		  steps {
		  	checkout scm
		  }
		}
		stage('Build') {
			steps {
				sh "echo ./build-docker.sh ${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
			}
		}
		stage('Push') {
			steps {
				sh "echo docker push gennyproject/alyson:${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
			}
		}
		stage('Deploy') {
			when { branch 'master' }
			steps {
				sh "echo deploying"
			}
		}
	}
}
