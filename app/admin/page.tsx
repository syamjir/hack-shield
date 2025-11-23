import { QuickAccess } from "./_components/QuickAccess";
import { StatCardList } from "./_components/StatCardList";
import { SystemSummary } from "./_components/SystemSummary";

export default function AdminHome() {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-primary-a20">
          Admin Dashboard
        </h2>
        <p className="text-dark-a0/50 mt-1">
          Overview of system activity and management tools.
        </p>
      </div>

      <StatCardList />

      {/* Quick Sections */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Quick Access */}
        <QuickAccess />

        {/* System Summary */}
        <SystemSummary />
      </div>
    </div>
  );
}
