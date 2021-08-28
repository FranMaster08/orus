import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { StockDto } from '../dto/StockDto';
import { InventoryEntity } from '../entities/inventory.entity';
import { InventoryService } from '../services/inventory.service';

@Controller('inventory')
@UseGuards(AuthGuard('jwt'))
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  async addInventory(@Body() stock: StockDto): Promise<InventoryEntity> {
    return await this.inventoryService.addInventory(stock);
  }

  @Get('doctor/:id')
  async getInventory(@Param('id') id: string): Promise<InventoryEntity[]> {
    return await this.inventoryService.getInventory(id);
  }
}
