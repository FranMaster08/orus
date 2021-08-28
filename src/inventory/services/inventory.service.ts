import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleType } from 'src/role/roletype.enum';
import { UsersService } from 'src/users/services/users.service';
import { Repository } from 'typeorm';
import { StockDto } from '../dto/StockDto';
import { InventoryEntity } from '../entities/inventory.entity';

@Injectable()
export class InventoryService {
  constructor(
    @InjectRepository(InventoryEntity, 'thv-db')
    private readonly inventoryRepository: Repository<InventoryEntity>,
    private readonly usersService: UsersService,
  ) {}

  async addInventory(stock: StockDto): Promise<InventoryEntity> {
    if (
      !(await this.usersService.findOne({
        where: { id: stock.doctorId, role: RoleType.DOCTOR },
      }))
    ) {
      throw new NotFoundException('Doctor not found');
    }

    const add = new InventoryEntity();
    add.doctorId = stock.doctorId;
    add.sku = stock.sku;
    add.name = stock.name;
    add.stock = stock.stock;

    return await this.inventoryRepository.save(add);
  }

  async getInventory(id: string): Promise<InventoryEntity[]> {
    if (
      !(await this.usersService.findOne({
        where: { id, role: RoleType.DOCTOR },
      }))
    ) {
      throw new NotFoundException('Doctor not found');
    }

    return await this.inventoryRepository.find({ where: { doctorId: id } });
  }
}
