"use client";

import React from "react";
import type { CardComponentProps } from "nextstepjs";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const ShadcnCustomCard = ({
  step,
  currentStep,
  totalSteps,
  nextStep,
  prevStep,
  skipTour,
  arrow,
}: CardComponentProps) => {
  return (
    <div className="relative z-[9999]">
      <Card className="w-[350px] shadow-xl border-2 bg-white">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              {step.icon && <span>{step.icon}</span>}
              {step.title}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentStep + 1} / {totalSteps}
            </div>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div>{step.content}</div>
        </CardContent>

        <CardFooter className="grid gap-2">
          <div className="flex justify-between">
            {step.showSkip && skipTour && (
              <Button variant="ghost" size="sm" onClick={skipTour}>
                Lewati
              </Button>
            )}
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={prevStep}>
                  Sebelumnya
                </Button>
              )}

              <Button
                size="sm"
                className="bg-primary text-white"
                onClick={nextStep}
              >
                {currentStep === totalSteps - 1 ? "Selesai" : "Next"}
              </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
      {arrow}
    </div>
  );
};

export default ShadcnCustomCard;
