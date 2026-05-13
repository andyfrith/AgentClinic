"use client";

import { useTherapies } from "@/hooks/use-therapies";
import { useCreateTherapy, useUpdateTherapy, useDeleteTherapy } from "@/hooks/use-crud";
import { CrudPage } from "@/components/CrudPage";

type TherapyItem = {
  id: number;
  name: string;
  description: string | null;
  duration: string;
  sideEffects: string[] | null;
};

const emptyForm = { name: "", description: "", duration: "", sideEffects: "" };

export default function StaffTherapiesPage() {
  const { data: therapies, isLoading, error } = useTherapies();
  const createTherapy = useCreateTherapy();
  const updateTherapy = useUpdateTherapy();
  const deleteTherapy = useDeleteTherapy();

  return (
    <CrudPage
      title="Manage Therapies"
      entityName="therapies"
      data={therapies}
      isLoading={isLoading}
      error={error}
      onSave={async (data) => {
        const form = data as typeof emptyForm;
        const sideEffects = form.sideEffects
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        if (data.id) {
          await updateTherapy.mutateAsync({
            id: data.id,
            name: form.name,
            description: form.description,
            duration: form.duration,
            sideEffects,
          });
        } else {
          await createTherapy.mutateAsync({
            name: form.name,
            description: form.description,
            duration: form.duration,
            sideEffects,
          });
        }
      }}
      onDelete={async (id) => {
        await deleteTherapy.mutateAsync(id);
      }}
      isSaving={createTherapy.isPending || updateTherapy.isPending}
      isDeleting={deleteTherapy.isPending}
      emptyForm={emptyForm}
      renderItem={(t) => (
        <div className="min-w-0">
          <div className="font-medium truncate">{(t as TherapyItem).name}</div>
          <div className="text-sm text-muted-foreground">{(t as TherapyItem).duration}</div>
        </div>
      )}
      renderForm={(form, onChange) => {
        const f = form as typeof emptyForm;
        return (
          <>
            <div>
              <label htmlFor="therapy-name" className="text-sm font-medium">
                Name
              </label>
              <input
                id="therapy-name"
                className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                value={f.name}
                onChange={(e) => onChange({ ...f, name: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="therapy-duration" className="text-sm font-medium">
                Duration
              </label>
              <input
                id="therapy-duration"
                className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                value={f.duration}
                onChange={(e) => onChange({ ...f, duration: e.target.value })}
              />
            </div>
            <div>
              <label htmlFor="therapy-side-effects" className="text-sm font-medium">
                Side Effects
              </label>
              <input
                id="therapy-side-effects"
                className="w-full mt-1 px-3 py-2 rounded-md border text-sm"
                value={f.sideEffects}
                onChange={(e) => onChange({ ...f, sideEffects: e.target.value })}
                placeholder="Comma-separated list"
              />
            </div>
            <div>
              <label htmlFor="therapy-description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="therapy-description"
                className="w-full mt-1 px-3 py-2 rounded-md border text-sm min-h-[80px]"
                value={f.description}
                onChange={(e) => onChange({ ...f, description: e.target.value })}
              />
            </div>
          </>
        );
      }}
    />
  );
}
