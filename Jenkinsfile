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
				sh "./build-docker.sh ${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
			}
		}
		stage('Push') {
			steps {
					withCredentials([usernamePassword(credentialsId: 'DOCKERHUB', usernameVariable: 'dockeruser', passwordVariable: 'dockerpass')]) {
						sh "docker login -u ${dockeruser} --password-stdin ${dockerpass}"
						sh "docker push gennyproject/alyson:${env.BRANCH_NAME}-${env.BUILD_NUMBER}"
					}
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
