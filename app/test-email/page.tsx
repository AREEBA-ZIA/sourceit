"use client";

export default function TestEmail() {
  const sendEmail = async () => {
    await fetch("/api/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        to: "areebazia959@gmail.com",
        subject: "Test Email",
        html: "<h1>Email working successfully!</h1>",
      }),
    });

    alert("Email Sent");
  };

  return (
    <button
      onClick={sendEmail}
      className="bg-blue-500 text-white p-4 rounded"
    >
      Send Test Email
    </button>
  );
}