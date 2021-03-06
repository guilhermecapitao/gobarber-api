import { Router } from 'express';
import multer from 'multer';
import CreateUserService from '../services/CreateUserService';
import UserMap from '../mappers/UserMap';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';
import UpdateUserAvatarService from '../services/UpdateUserAvatarService';

const usersRouter = Router();
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
  const { name, email, password } = request.body;

  const createUser = new CreateUserService();

  const user = await createUser.execute({ name, email, password });

  const mappedUser = UserMap.toDTO(user);

  return response.json(mappedUser);
});

export default usersRouter;

usersRouter.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  async (request, response) => {
    const updateUserAvatar = new UpdateUserAvatarService();

    const user = await updateUserAvatar.execute({
      user_id: request.user.id,
      avatarFileName: request.file.filename,
    });

    const mappedUser = UserMap.toDTO(user);

    return response.json(mappedUser);
  },
);
