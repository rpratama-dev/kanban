const CategoryController = require('../controllers/CategoryController');
const OrganizationController = require('../controllers/OrganizationController');
const TaskController = require('../controllers/TaskController');
const UserController = require('../controllers/UserController');
const { authentication, authorizeOrganization, authorizeCategory, authorizeTask } = require('../middleware/auth');

const router = require('express').Router();

router.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Connection OK', status: 200 })
})


router.post('/login', UserController.login);
router.post('/register', UserController.register);
router.post('/googlesignin', UserController.googlesignin);

router.use(authentication)

router.get('/users/verify', UserController.verifyToken);
router.get('/users/organizations', UserController.userOganization);

/** 
 * Router Organizations
 */
router.get('/organizations', OrganizationController.index); // get by id user was created organization
router.post('/organizations', OrganizationController.store); // All User can create their organization
router.get('/organizations/:id', authorizeOrganization, OrganizationController.show); // show organization by id need authorize
router.put('/organizations/:id', authorizeOrganization, OrganizationController.update);
router.delete('/organizations/:id', authorizeOrganization, OrganizationController.destroy);
router.post('/organizations/member', authorizeOrganization, OrganizationController.addMember);
router.delete('/organizations/member/:id', authorizeOrganization, OrganizationController.destroyMember);

/** 
 * Router Categories
 */
router.get('/categories', authorizeOrganization, CategoryController.index);
router.post('/categories', authorizeOrganization, CategoryController.store);
router.get('/categories/:id', authorizeOrganization, CategoryController.show);
router.put('/categories/:id', authorizeCategory, CategoryController.update);
router.delete('/categories/:id', authorizeCategory, CategoryController.destroy);

/** 
 * Router Task
 */
// router.get('/tasks', TaskController.index);
router.post('/tasks', authorizeOrganization, TaskController.store);
router.get('/tasks/:id', authorizeTask, TaskController.show);
router.put('/tasks/:id', authorizeTask, TaskController.update);
router.patch('/tasks/:id', authorizeTask, TaskController.patch);
router.delete('/tasks/:id', authorizeTask, TaskController.destroy);

module.exports = router;