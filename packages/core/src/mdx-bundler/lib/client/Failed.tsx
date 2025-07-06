import { MDXContentProps } from 'mdx-bundler/dist/client';

export interface FailedProps extends MDXContentProps {
  error?: string | Error | null;
  onError?: (err: string | Error) => void;
};

function Failed({ error, onError }: FailedProps) {
  const message =
    typeof error === 'string'
      ? error
      : error instanceof Error
      ? error.message
      : 'Unknown error';

  if (error && onError) {
    onError(error);
  }

  return (
    <div
      style={{
        background: 'linear-gradient(90deg, #ff5f6d, #ffc371)',
        color: '#222',
        borderRadius: '12px',
        padding: '10px 0',
        margin: '2rem auto',
        width: '100%',
        boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
        textAlign: 'center',
      }}
    >
      <svg
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        style={{ marginBottom: 16 }}
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="12" cy="12" r="10" fill="#fff0f0" />
        <path
          d="M8 8l8 8M16 8l-8 8"
          stroke="#ff5f6d"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
      <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 700 }}>
        Failed to Render
      </h1>
      <p style={{ marginTop: 12, color: '#b71c1c', fontWeight: 500 }}>
        {message}
      </p>
    </div>
  );
}

export default Failed;
