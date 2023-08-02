export default function Page({ params }: { params: { error: string } }) {
  throw new Error(params.error);
}
