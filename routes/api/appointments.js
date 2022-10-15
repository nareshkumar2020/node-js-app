const express = require('express');
const ROLES_LIST = require('../../config/rolesList');
const router = express.Router();
const appointmentsController = require('../../controllers/appointmentsController');
const verifyRoles = require('../../middleware/verifyRoles');

router.route('/')
    .get(appointmentsController.getAllAppointments)
    .post(verifyRoles(ROLES_LIST.User, ROLES_LIST.Editor, ROLES_LIST.Admin), appointmentsController.createNewAppointment)
    .put(verifyRoles(ROLES_LIST.Editor, ROLES_LIST.Admin), appointmentsController.updateAppointment)
    .delete(verifyRoles(ROLES_LIST.Admin), appointmentsController.deleteAppointment);

router.route('/:id')
    .get(appointmentsController.getAppointment);

module.exports = router;
