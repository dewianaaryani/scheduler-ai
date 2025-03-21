import React from "react";
import { requireUser } from "../lib/hooks";

export default async function page() {
  const session = await requireUser();
  return <div>page</div>;
}
