"use client";

import { useState } from "react";
import { Zap, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ProfileStatusBadge, ProfileItemGroup } from "../profile/profile-item";

import { PricingPlanItem, CurrentUser, MOCK_CURRENT_USER } from "./types";
import { INITIAL_PLANS } from "./mock-data";
import { PlanPricingCard } from "./plan-pricing-card";
import { PlanDialog } from "./plan-dialog";
import { DeleteConfirmDialog } from "./delete-confirm-dialog";

interface AvailablePlansProps {
  currentUser?: CurrentUser;
  currentPlanId?: string;
  onPlanSelect?: (planId: string) => void;
}

export function AvailablePlans({
  currentUser = MOCK_CURRENT_USER,
  currentPlanId = "plan_pro_monthly",
  onPlanSelect,
}: AvailablePlansProps) {
  const [plans, setPlans] = useState<PricingPlanItem[]>(INITIAL_PLANS);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<PricingPlanItem | null>(null);

  const [planToDelete, setPlanToDelete] = useState<PricingPlanItem | null>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const isAdmin = currentUser.role === "admin";

  const handleSelect = (planId: string) => {
    if (onPlanSelect) {
      onPlanSelect(planId);
    } else {
      console.log(`هدایت به درگاه پرداخت برای پلن: ${planId}`);
    }
  };

  const handleOpenCreate = () => {
    setEditingPlan(null);
    setIsDialogOpen(true);
  };

  const handleOpenEdit = (plan: PricingPlanItem) => {
    setEditingPlan(plan);
    setIsDialogOpen(true);
  };

  const handleOpenDelete = (plan: PricingPlanItem) => {
    setPlanToDelete(plan);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!planToDelete) return;
    setPlans((prev) => prev.filter((p) => p.id !== planToDelete.id));
    setPlanToDelete(null);
  };

  const handleSavePlan = (planData: PricingPlanItem) => {
    if (editingPlan) {
      setPlans((prev) =>
        prev.map((item) => (item.id === planData.id ? planData : item))
      );
    } else {
      setPlans((prev) => [...prev, planData]);
    }
  };

  return (
    <>
      <Card
        className="w-full rounded-2xl border-border/80 shadow-sm overflow-hidden py-0! gap-0"
        dir="rtl"
      >
        <CardHeader className="flex flex-row items-center justify-between py-3.5! px-4 border-b bg-muted/20 space-y-0">
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-primary" />
            <CardTitle className="text-base font-bold text-foreground">
              اشتراک‌های موجود
            </CardTitle>
            <ProfileStatusBadge>
              {plans.length.toLocaleString("fa-IR")} عدد
            </ProfileStatusBadge>
          </div>

          {isAdmin && (
            <Button
              size="sm"
              variant="outline"
              onClick={handleOpenCreate}
              className="h-8 gap-1.5 px-3 text-xs shadow-none hover:bg-muted"
            >
              <Plus className="h-3.5 w-3.5 text-primary" />
              <span>اشتراک جدید</span>
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          <ProfileItemGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 items-stretch">
              {plans.map((plan) => (
                <PlanPricingCard
                  key={plan.id}
                  plan={plan}
                  isCurrentPlan={plan.id === currentPlanId}
                  isAdmin={isAdmin}
                  onSelectPlan={handleSelect}
                  onEditPlan={handleOpenEdit}
                  onDeletePlan={handleOpenDelete}
                />
              ))}
            </div>
          </ProfileItemGroup>
        </CardContent>
      </Card>

      {/* مودال ساخت یا ویرایش پلن */}
      {isDialogOpen && (
        <PlanDialog
          open={isDialogOpen}
          onOpenChange={setIsDialogOpen}
          onSubmitPlan={handleSavePlan}
          initialData={editingPlan}
        />
      )}

      {/* مودال تأیید حذف پلن */}
      <DeleteConfirmDialog
        open={isDeleteOpen}
        onOpenChange={setIsDeleteOpen}
        planName={planToDelete?.name}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
