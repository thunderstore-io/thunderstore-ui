import "./UploadProgressBar.css";

export interface UploadProgressBarProps {
  progress: number;
  labelId?: string;
}

export function UploadProgressBar({
  progress,
  labelId,
}: UploadProgressBarProps) {
  const value = Math.min(100, Math.max(0, Math.trunc(progress)));

  return (
    <div
      className="upload-progress"
      role="progressbar"
      {...(labelId
        ? { "aria-labelledby": labelId }
        : { "aria-label": "Upload progress" })}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={value}
      aria-valuetext={`${value}%`}
    >
      <div className="upload-progress__bar" style={{ width: `${value}%` }} />
    </div>
  );
}
