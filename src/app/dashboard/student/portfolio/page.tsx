import { redirect } from "next/navigation";

export default function StudentPortfolioRedirect() {
  redirect("/dashboard/student/profile");
}
