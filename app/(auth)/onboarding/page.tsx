// ToDo: Modify this component on next related ticket.

'use client';
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import ApiConnector from "@/app/services/ApiConnector";// Replace with your actual Mui imports
import AccountProfile from "@/components/AccountProfile";

const apiConnectorInstance = ApiConnector.getInstance();

export default function Onboarding() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session) {
      apiConnectorInstance.getUserFromEmail(session.user.email)
        .then((res) => {
          setAvatarUrl(res.data.image);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [status, session]);

  const user = session?.user;

  const handleOnboarding = () => {
    console.log("Onboarding completed");
    router.push("/");
  };

  const onSubmit = (data: any) => {
    // Handle form submission if needed
    console.log(data);
    handleOnboarding();
  };

  // const handleImage = (e) => {
  //   // Handle image change logic if needed
  //   const file = e.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setAvatarUrl(reader.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  const btnTitle = "Continue";

  return (
    <main className='mx-auto flex max-w-3xl flex-col justify-start px-10 py-20'>
      <h1 className='head-text'>Onboarding</h1>
      <p className='mt-3 text-base-regular text-light-2'>
        Complete your profile now, to use NearFarm Platform.
      </p>

      <section className='mt-9  p-10'>
        <AccountProfile user={user} btnTitle={btnTitle} />
      </section>
    </main>
  );
}
