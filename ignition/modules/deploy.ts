import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AdminModule = buildModule("AdminModule", (m) => {
  const admin = m.contract("Admin");

  console.log("AdminModule", { admin });

  return { admin };
});

export default AdminModule;
