import { Body, Controller, Delete, Param, Post, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiTags } from '@nestjs/swagger';
import { UserIdDto } from 'src/users/dto/userId.dto';
import { IdentitiesService } from './identities.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { RejectFilesDto } from 'src/identities/dto/reject-files.dto';
import { Role } from 'src/auth/role.enum';

@ApiTags('identities')
@ApiBearerAuth()
@Controller('identities')
export class IdentitiesController {

    constructor(private identitiesService: IdentitiesService) { }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.User)
    @Post('/verifyId')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    @UseInterceptors(FilesInterceptor('files', 2, { dest: 'src/assets/images' }))
    verifyId(@UploadedFiles() files: Array<Express.Multer.File>, @Body() userIdDto: UserIdDto): Promise<any> {
        return this.identitiesService.verifyId(userIdDto, files);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Post('/approveId')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    approveId(@Body() userIdDto: UserIdDto): Promise<void> {
        return this.identitiesService.approveId(userIdDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Post('/rejectId')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    rejectId(@Body() rejectFilesDto: RejectFilesDto): Promise<void> {
        return this.identitiesService.rejectId(rejectFilesDto);
    }

    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(Role.Admin)
    @Delete('/:id/deleteId')
    @ApiInternalServerErrorResponse({ description: 'Internal Server Error.' })
    deleteId(@Param() userIdDto: UserIdDto): Promise<void> {
        return this.identitiesService.deleteId(userIdDto);
    }

}

