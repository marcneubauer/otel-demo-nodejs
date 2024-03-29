import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const serviceName = `${process.env.NODE_ENV || 'any'}-${process.env.npm_package_name || 'otel-demo'}`;
const serviceVersion = process.env.npm_package_version ?? 0;

const OpenTelemetryResource = Resource.default().merge(
  new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: serviceName,
    [SemanticResourceAttributes.SERVICE_VERSION]: serviceVersion,
  }),
);

export { OpenTelemetryResource, SemanticResourceAttributes };


// SemanticResourceAttributes = {
//     CLOUD_PROVIDER: 'cloud.provider',
//     CLOUD_ACCOUNT_ID: 'cloud.account.id',
//     CLOUD_REGION: 'cloud.region',
//     CLOUD_AVAILABILITY_ZONE: 'cloud.availability_zone',
//     CLOUD_PLATFORM: 'cloud.platform',
//     AWS_ECS_CONTAINER_ARN: 'aws.ecs.container.arn',
//     AWS_ECS_CLUSTER_ARN: 'aws.ecs.cluster.arn',
//     AWS_ECS_LAUNCHTYPE: 'aws.ecs.launchtype',
//     AWS_ECS_TASK_ARN: 'aws.ecs.task.arn',
//     AWS_ECS_TASK_FAMILY: 'aws.ecs.task.family',
//     AWS_ECS_TASK_REVISION: 'aws.ecs.task.revision',
//     AWS_EKS_CLUSTER_ARN: 'aws.eks.cluster.arn',
//     AWS_LOG_GROUP_NAMES: 'aws.log.group.names',
//     AWS_LOG_GROUP_ARNS: 'aws.log.group.arns',
//     AWS_LOG_STREAM_NAMES: 'aws.log.stream.names',
//     AWS_LOG_STREAM_ARNS: 'aws.log.stream.arns',
//     CONTAINER_NAME: 'container.name',
//     CONTAINER_ID: 'container.id',
//     CONTAINER_RUNTIME: 'container.runtime',
//     CONTAINER_IMAGE_NAME: 'container.image.name',
//     CONTAINER_IMAGE_TAG: 'container.image.tag',
//     DEPLOYMENT_ENVIRONMENT: 'deployment.environment',
//     DEVICE_ID: 'device.id',
//     DEVICE_MODEL_IDENTIFIER: 'device.model.identifier',
//     DEVICE_MODEL_NAME: 'device.model.name',
//     FAAS_NAME: 'faas.name',
//     FAAS_ID: 'faas.id',
//     FAAS_VERSION: 'faas.version',
//     FAAS_INSTANCE: 'faas.instance',
//     FAAS_MAX_MEMORY: 'faas.max_memory',
//     HOST_ID: 'host.id',
//     HOST_NAME: 'host.name',
//     HOST_TYPE: 'host.type',
//     HOST_ARCH: 'host.arch',
//     HOST_IMAGE_NAME: 'host.image.name',
//     HOST_IMAGE_ID: 'host.image.id',
//     HOST_IMAGE_VERSION: 'host.image.version',
//     K8S_CLUSTER_NAME: 'k8s.cluster.name',
//     K8S_NODE_NAME: 'k8s.node.name',
//     K8S_NODE_UID: 'k8s.node.uid',
//     K8S_NAMESPACE_NAME: 'k8s.namespace.name',
//     K8S_POD_UID: 'k8s.pod.uid',
//     K8S_POD_NAME: 'k8s.pod.name',
//     K8S_CONTAINER_NAME: 'k8s.container.name',
//     K8S_REPLICASET_UID: 'k8s.replicaset.uid',
//     K8S_REPLICASET_NAME: 'k8s.replicaset.name',
//     K8S_DEPLOYMENT_UID: 'k8s.deployment.uid',
//     K8S_DEPLOYMENT_NAME: 'k8s.deployment.name',
//     K8S_STATEFULSET_UID: 'k8s.statefulset.uid',
//     K8S_STATEFULSET_NAME: 'k8s.statefulset.name',
//     K8S_DAEMONSET_UID: 'k8s.daemonset.uid',
//     K8S_DAEMONSET_NAME: 'k8s.daemonset.name',
//     K8S_JOB_UID: 'k8s.job.uid',
//     K8S_JOB_NAME: 'k8s.job.name',
//     K8S_CRONJOB_UID: 'k8s.cronjob.uid',
//     K8S_CRONJOB_NAME: 'k8s.cronjob.name',
//     OS_TYPE: 'os.type',
//     OS_DESCRIPTION: 'os.description',
//     OS_NAME: 'os.name',
//     OS_VERSION: 'os.version',
//     PROCESS_PID: 'process.pid',
//     PROCESS_EXECUTABLE_NAME: 'process.executable.name',
//     PROCESS_EXECUTABLE_PATH: 'process.executable.path',
//     PROCESS_COMMAND: 'process.command',
//     PROCESS_COMMAND_LINE: 'process.command_line',
//     PROCESS_COMMAND_ARGS: 'process.command_args',
//     PROCESS_OWNER: 'process.owner',
//     PROCESS_RUNTIME_NAME: 'process.runtime.name',
//     PROCESS_RUNTIME_VERSION: 'process.runtime.version',
//     PROCESS_RUNTIME_DESCRIPTION: 'process.runtime.description',
//     SERVICE_NAME: 'service.name',
//     SERVICE_NAMESPACE: 'service.namespace',
//     SERVICE_INSTANCE_ID: 'service.instance.id',
//     SERVICE_VERSION: 'service.version',
//     TELEMETRY_SDK_NAME: 'telemetry.sdk.name',
//     TELEMETRY_SDK_LANGUAGE: 'telemetry.sdk.language',
//     TELEMETRY_SDK_VERSION: 'telemetry.sdk.version',
//     TELEMETRY_AUTO_VERSION: 'telemetry.auto.version',
//     WEBENGINE_NAME: 'webengine.name',
//     WEBENGINE_VERSION: 'webengine.version',
//     WEBENGINE_DESCRIPTION: 'webengine.description'
// };