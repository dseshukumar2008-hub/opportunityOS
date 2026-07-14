/**
 * Centralized AI Request Logging Service
 * Handles formatting and outputting telemetry for AI inference.
 */

export const aiLogger = {
  logRequest: (telemetry) => {
    const {
      feature,
      provider,
      model,
      startTime,
      endTime,
      success,
      errorType,
      fallbackOccurred
    } = telemetry;

    const responseTime = endTime - startTime;
    const timestamp = new Date(startTime).toISOString();

    const logPrefix = `[AI Logger | ${timestamp}]`;
    const status = success ? 'SUCCESS' : 'FAILED';
    const fallbackText = fallbackOccurred ? ' (Fallback Triggered)' : '';
    const errorText = errorType ? ` | Error: ${errorType}` : '';

    const logMessage = `${logPrefix} [${feature}] ${status}${fallbackText}
    -> Provider: ${provider}
    -> Model: ${model}
    -> Response Time: ${responseTime}ms${errorText}`;

    if (success) {
      console.log(logMessage);
    } else {
      console.warn(logMessage);
    }
  }
};
