import EntityController from '@business/core/entity.controller';
import { Injectable } from '@angular/core';
import { EntityNameList } from '@business/core/entity-list';
import ExcludeModification from '@business/modules/exclude-modification/exclude-modification.model';
import CalculationModificationController from '@business/modules/calculation-modification/calculation-modification.controller';
import IDataMapper from '@business/dal/mappers/data-mapper.interface';
import { IEntityStorage } from '@business/storages/entity-storage.interface';

@Injectable({
  providedIn: 'root',
})
export default class ExcludeModificationController extends EntityController<ExcludeModification> {
  constructor(private calculationModificationController: CalculationModificationController,) {
    super();
  }

  public async create(userUid: string, paymentUid: string): Promise<void> {
    const excludeModification = ExcludeModification.create(userUid, paymentUid);

    const mapper = this.mappersFactory.createExcludeModificationMapper();
    await mapper.create(excludeModification);

    const storage = this.storageFactory.getStorage(EntityNameList.excludeModification);
    storage.set(excludeModification);
  }

  public async updateList(userUidsToExclude: string[], paymentUid: string): Promise<void> {
    const storage = this.storageFactory.getStorage(EntityNameList.excludeModification);
    const existedExcludeModifications = storage.getByParams({ paymentUid });

    const userUidsToCreate = new Set(userUidsToExclude);
    const userUidsToExcludeSet = new Set(userUidsToExclude);
    for (const existedExcludeModification of existedExcludeModifications) {
      if (userUidsToExcludeSet.has(existedExcludeModification.userUid)) {
        userUidsToCreate.delete(existedExcludeModification.userUid);
      } else {
        await this.delete(existedExcludeModification.uid);
      }
    }

    for (const userUidToCreate of userUidsToCreate) {
      await this.create(userUidToCreate, paymentUid);
    }

    const calculationStorage = this.storageFactory.getStorage(EntityNameList.calculationModification);
    for (const userUidToExclude of Array.from(userUidsToExclude.values())) {
      const calcModifications = calculationStorage.getByParams({ paymentUid });
      for (const calcModification of calcModifications) {
        if (!calcModification.isUserInvolved(userUidToExclude)) continue;

        calcModification.removeUser(userUidToExclude);

        if (calcModification.usersUid.length === 0) {
          await this.calculationModificationController.delete(calcModification.uid);
        } else {
          await this.calculationModificationController.update(calcModification);
        }
      }
    }
  }

  protected getRelatedMapper(): IDataMapper<ExcludeModification> {
    return this.mappersFactory.createExcludeModificationMapper();
  }

  protected getRelatedStorage(): IEntityStorage<ExcludeModification> {
    return this.storageFactory.getStorage(EntityNameList.excludeModification);
  }
}
