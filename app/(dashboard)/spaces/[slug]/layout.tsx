// Parallel route layout — children renders the feed/full-page, @modal renders the slide-in
export default function SpaceSlugLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <>
      {children}
      {modal}
    </>
  );
}
