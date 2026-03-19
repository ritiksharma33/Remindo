import { AlertCircle, CheckCircle } from "lucide-react";

export default function ReviewBanner({ count }) {
  if (count === 0) return null;

  return (
    <div className="mb-6 rounded-xl border border-yellow-500/20 bg-yellow-500/10 p-4">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-yellow-500/20 p-2 text-yellow-500">
          <AlertCircle size={20} />
        </div>
        <div>
          <h3 className="font-semibold text-yellow-200">
            {count} Memories Fading
          </h3>
          <p className="text-sm text-yellow-500/80">
            Reviewing now resets your forgetting curve to 100%. Don't break the chain.
          </p>
        </div>
      </div>
    </div>
  );
}