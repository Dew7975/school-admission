import './globals.css';

export const metadata = {
  title: 'School Admission Portal',
  description: 'Fore Forms AB Internship Onboarding Task',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}