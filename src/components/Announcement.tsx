import { FREE_DELIVERY } from "@/lib/data";

export default function Announcement() {
  return (
    <div className="announce">
      Free local delivery on orders over <b>${FREE_DELIVERY}</b> · Fresh batches out of the oven at 7am, 11am &amp; 3pm
    </div>
  );
}
