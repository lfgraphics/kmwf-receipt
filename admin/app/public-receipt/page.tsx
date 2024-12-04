import { useRouter } from "next/router";

interface QueryParams {
  phoneNo?: string;
  rectNo?: string;
}

const QueryPage: React.FC = () => {
  const router = useRouter();

  // Cast query to our interface
  const { phoneNo, rectNo } = router.query as QueryParams;

  return (
    <div className="p-4">
      <h1 className="text-lg font-bold">Query Parameters</h1>
      <p>
        <strong>Phone Number:</strong> {phoneNo ?? "Not provided"}
      </p>
      <p>
        <strong>Rect Number:</strong> {rectNo ?? "Not provided"}
      </p>
    </div>
  );
};

export default QueryPage;