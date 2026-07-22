"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Plus, Trash2, Tag } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface SeasonalPrice {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  pricePerHour: number;
  dayOfWeek: string | null;
}

const DAY_OPTIONS = [
  { value: "ALL", label: "Every day" },
  { value: "WEEKDAYS", label: "Weekdays (Mon-Fri)" },
  { value: "WEEKENDS", label: "Weekends (Sat-Sun)" },
  { value: "MONDAY", label: "Monday" },
  { value: "TUESDAY", label: "Tuesday" },
  { value: "WEDNESDAY", label: "Wednesday" },
  { value: "THURSDAY", label: "Thursday" },
  { value: "FRIDAY", label: "Friday" },
  { value: "SATURDAY", label: "Saturday" },
  { value: "SUNDAY", label: "Sunday" },
];

const PRESETS = [
  { name: "Weekend Premium", dayOfWeek: "WEEKENDS", priceModifier: "+20%" },
  { name: "Holiday Surge", dayOfWeek: "ALL", priceModifier: "+50%" },
  { name: "Weekday Discount", dayOfWeek: "WEEKDAYS", priceModifier: "-15%" },
];

interface SeasonalPricingManagerProps {
  listingId: string;
  basePricePerHour: number;
}

export function SeasonalPricingManager({ listingId, basePricePerHour }: SeasonalPricingManagerProps) {
  const [prices, setPrices] = useState<SeasonalPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    startDate: "",
    endDate: "",
    pricePerHour: "",
    dayOfWeek: "ALL",
  });
  const [saving, setSaving] = useState(false);

  const fetchPrices = async () => {
    try {
      const res = await fetch(`/api/seasonal-prices?listingId=${listingId}`);
      const data = await res.json();
      setPrices(data.seasonalPrices || []);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, [listingId]);

  const handleAdd = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate || !formData.pricePerHour) {
      toast.error("Please fill in all fields");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/seasonal-prices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          name: formData.name,
          startDate: formData.startDate,
          endDate: formData.endDate,
          pricePerHour: parseFloat(formData.pricePerHour),
          dayOfWeek: formData.dayOfWeek === "ALL" ? null : formData.dayOfWeek,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      toast.success("Seasonal price added");
      setPrices((prev) => [...prev, data.seasonalPrice].sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime()));
      setFormData({ name: "", startDate: "", endDate: "", pricePerHour: "", dayOfWeek: "ALL" });
      setShowForm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to add");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/seasonal-prices/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast.success("Removed");
      setPrices((prev) => prev.filter((p) => p.id !== id));
    } catch {
      toast.error("Failed to remove");
    }
  };

  const applyPreset = (preset: typeof PRESETS[0]) => {
    const basePrice = basePricePerHour || 10;
    let newPrice = basePrice;
    const modifier = parseInt(preset.priceModifier);
    if (preset.priceModifier.startsWith("+")) {
      newPrice = basePrice * (1 + modifier / 100);
    } else {
      newPrice = basePrice * (1 - Math.abs(modifier) / 100);
    }

    const today = new Date();
    const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    setFormData({
      name: preset.name,
      startDate: format(today, "yyyy-MM-dd"),
      endDate: format(monthEnd, "yyyy-MM-dd"),
      pricePerHour: newPrice.toFixed(2),
      dayOfWeek: preset.dayOfWeek,
    });
    setShowForm(true);
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading seasonal prices...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <p className="text-sm font-medium">Seasonal Pricing</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowForm(!showForm)}
          className="text-xs"
        >
          <Plus className="h-3 w-3 mr-1" />
          Add Rule
        </Button>
      </div>

      {/* Presets */}
      {!showForm && prices.length === 0 && (
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((preset) => (
            <button
              key={preset.name}
              onClick={() => applyPreset(preset)}
              className="text-xs border rounded-lg px-3 py-1.5 hover:bg-muted/50 transition-colors flex items-center gap-1.5"
            >
              <Tag className="h-3 w-3" />
              {preset.name} ({preset.priceModifier})
            </button>
          ))}
        </div>
      )}

      {/* Existing Rules */}
      {prices.length > 0 && (
        <div className="space-y-2">
          {prices.map((price) => (
            <Card key={price.id} className="border-dashed">
              <CardContent className="p-3 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{price.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {format(new Date(price.startDate), "MMM d")} – {format(new Date(price.endDate), "MMM d, yyyy")}
                    {price.dayOfWeek && ` · ${DAY_OPTIONS.find((d) => d.value === price.dayOfWeek)?.label || price.dayOfWeek}`}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-sm font-semibold text-green-600">${price.pricePerHour}/hr</span>
                  <button
                    onClick={() => handleDelete(price.id)}
                    className="text-red-400 hover:text-red-600 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Form */}
      {showForm && (
        <Card className="border-green-200 bg-green-50/50">
          <CardContent className="p-4 space-y-3">
            <div>
              <Label className="text-sm">Rule Name</Label>
              <Input
                placeholder="e.g. Weekend Premium, Holiday Surge"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Start Date</Label>
                <Input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="mt-1"
                />
              </div>
              <div>
                <Label className="text-sm">End Date</Label>
                <Input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm">Price per Hour ($)</Label>
                <Input
                  type="number"
                  step="0.50"
                  min="1"
                  placeholder={basePricePerHour ? String(basePricePerHour) : "15"}
                  value={formData.pricePerHour}
                  onChange={(e) => setFormData({ ...formData, pricePerHour: e.target.value })}
                  className="mt-1"
                />
                {basePricePerHour > 0 && formData.pricePerHour && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Base: ${basePricePerHour}/hr · {Number(formData.pricePerHour) >= basePricePerHour ? "+" : ""}
                    {((Number(formData.pricePerHour) - basePricePerHour) / basePricePerHour * 100).toFixed(0)}%
                  </p>
                )}
              </div>
              <div>
                <Label className="text-sm">Applies To</Label>
                <Select
                  value={formData.dayOfWeek}
                  onValueChange={(v) => { if (v) setFormData({ ...formData, dayOfWeek: v }); }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {DAY_OPTIONS.map((d) => (
                      <SelectItem key={d.value} value={d.value}>
                        {d.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2 justify-end pt-1">
              <Button variant="outline" size="sm" onClick={() => setShowForm(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={handleAdd}
                disabled={saving || !formData.name || !formData.startDate || !formData.endDate || !formData.pricePerHour}
              >
                {saving ? "Adding..." : "Add Rule"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
