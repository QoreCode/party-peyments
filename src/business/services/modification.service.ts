import CalculationModification from '../models/modifications/calculation-modification';
import ExcludeModification from '../models/modifications/exclude-modification';
import { ModificationType } from '../models/modifications/modification';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ModificationService {
  // paymentId - modId | Modification
  private calculationModifications: Map<string, Map<string, CalculationModification>> = new Map();
  private executionModifications: Map<string, Map<string, ExcludeModification>> = new Map();

  public addEntity(modification: ExcludeModification | CalculationModification): void {
    if (modification.type === ModificationType.Calculation) {
      const paymentUid = modification.paymentUid;
      if (!this.calculationModifications.has(paymentUid)) {
        this.calculationModifications.set(paymentUid, new Map());
      }

      this.calculationModifications.get(paymentUid)?.set(modification.uid, modification as CalculationModification);
    } else {
      const paymentUid = modification.paymentUid;
      if (!this.executionModifications.has(paymentUid)) {
        this.executionModifications.set(paymentUid, new Map());
      }

      this.executionModifications.get(paymentUid)?.set(modification.uid, modification as ExcludeModification);
    }
  }

  public getCalculationModifications(paymentUid: string): CalculationModification[] {
    const modificationsMap = this.calculationModifications.get(paymentUid);
    if (modificationsMap === undefined) {
      return [];
    }

    return Array.from(modificationsMap.values());
  }

  public getExecutionModifications(paymentUid: string): ExcludeModification[] {
    const modificationsMap = this.executionModifications.get(paymentUid);
    if (modificationsMap === undefined) {
      return [];
    }

    return Array.from(modificationsMap.values());
  }
}
