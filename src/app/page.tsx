import { redirect } from "next/navigation";
import { auth } from "../auth";
import connectDb from "../lib/db";
import User from "../models/user.model";
import EditRoleAndMobile from "../components/EditRoleAndMobile";
import Navbar from "../components/Navbar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import DeliveryBoyDashboard from "../components/DeliveryBoyDashboard";

export default async function Home() {
  await connectDb();
  const session = await auth();
  const user = await User.findById(session?.user?.id);
  if (!user) {
    redirect("/login");
  }

  const inComplete = !user.mobile || !user.role || (!user.mobile && user.role=="user");

  if(inComplete){
    return <EditRoleAndMobile/>
  }

  const plainUser = JSON.parse(JSON.stringify(user));

  return (
    <>
    <Navbar user={plainUser}/>
    {user.role == 'user'? (
      <UserDashboard/>
    ):user.role == 'admin'? (
      <AdminDashboard/>
    ): <DeliveryBoyDashboard/>}
    </>
  )
}
