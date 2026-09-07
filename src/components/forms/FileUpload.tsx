import { useRef, useState } from 'react';

interface FileUploadProps {
  file: File | null;
  accept?: string;
  error?: string;
  onFileChange: (file: File | null) => void;
}

const MAX_FILE_SIZE = 50 * 1024 * 1024;

const ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
];

function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function FileUpload({
  file,
  accept,
  error,
  onFileChange,
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [localError, setLocalError] =
    useState<string>('');

  const validateFile = (
    selectedFile: File,
  ): boolean => {
    if (!ALLOWED_FILE_TYPES.includes(selectedFile.type)) {
      setLocalError(
        'Only PDF, DOC, and DOCX files are allowed.',
      );

      return false;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setLocalError(
        'File size must be 50 MB or less.',
      );

      return false;
    }

    setLocalError('');

    return true;
  };

  const handleFileChange = (
    selectedFile: File | null,
  ) => {
    if (!selectedFile) {
      return;
    }

    if (validateFile(selectedFile)) {
      onFileChange(selectedFile);
    } else {
      onFileChange(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleDrop = (
    event: React.DragEvent<HTMLLabelElement>,
  ) => {
    event.preventDefault();

    const droppedFile =
      event.dataTransfer.files?.[0] ?? null;

    handleFileChange(droppedFile);
  };

  const handleDragOver = (
    event: React.DragEvent<HTMLLabelElement>,
  ) => {
    event.preventDefault();
  };

  const handleRemove = () => {
    onFileChange(null);
    setLocalError('');

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const displayedError = localError || error;

  return (
    <div className="form-field">
      <label
        htmlFor="supporting-file"
        className="form-label"
      >
        Upload Contract
      </label>

      {!file ? (
        <label
          htmlFor="supporting-file"
          className={`file-upload ${
            displayedError
              ? 'file-upload--error'
              : ''
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          <input
            ref={fileInputRef}
            id="supporting-file"
            name="supporting-file"
            type="file"
            accept={
              accept ||
              '.pdf,.doc,.docx'
            }
            onChange={(event) => {
              const selectedFile =
                event.target.files?.[0] ?? null;

              handleFileChange(selectedFile);
            }}
            aria-describedby={
              displayedError
                ? 'supporting-file-error'
                : undefined
            }
          />

          <span
            className="file-upload-icon"
            aria-hidden="true"
          >
            ↑
          </span>

          <span className="file-upload-text">
            Choose a file or drag and drop
          </span>

          <span className="file-upload-hint">
            PDF, DOC, DOCX up to 50MB
          </span>
        </label>
      ) : (
        <div className="selected-file">
          <div
            className="selected-file-icon"
            aria-hidden="true"
          >
            📄
          </div>

          <div className="selected-file-info">
            <strong>{file.name}</strong>

            <span>
              {formatFileSize(file.size)}
            </span>
          </div>

          <button
            type="button"
            className="remove-file-button"
            onClick={handleRemove}
            aria-label={`Remove ${file.name}`}
          >
            Remove
          </button>
        </div>
      )}

      {displayedError && (
        <p
          className="form-error"
          id="supporting-file-error"
        >
          {displayedError}
        </p>
      )}
    </div>
  );
}

export default FileUpload;

