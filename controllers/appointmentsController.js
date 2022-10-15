const Appointment = require('../model/Appointment');

const getAllAppointments = async (req, res) => {
    const result = await Appointment.find({}).exec();
    res.json(result);
}

const createNewAppointment = async (req, res) => {

    if (!req.body.name || !req.body.contactNumber || !req.body.date) {
        res.status(400).json({ 'message': 'Name,, Contact number and Date are required' });
    }

    const appointmentExists = await Appointment.findOne({ date: req.body.date }).exec();

    if (appointmentExists) {
        res.status(201).json({ 'message': 'Appointment not available for the date' });
    } else {
        const newAppointment = {
            "name": req.body.name,
            "contactNumber": req.body.contactNumber,
            "date": req.body.date
        }
        const result = await Appointment.create(newAppointment)
        res.json(newAppointment)
    }

}

const updateAppointment = (req, res) => {
    // rewrite logic
    if (!req.body.name || !req.body.contactNumber || !req.body.date) {
        res.status(400).json({ 'message': 'Name,, Contact number and Date are required' });
    }

    const appointmentExists = data.appointments.find(appoint => appoint.date == req.body.date)

    if (appointmentExists) {
        res.status(400).json({ 'message': 'Appointment not available for the date' });
    } else {
        data.setAppointments([...data.appointments, req.body])
        res.json({
            "name": req.body.name,
            "contactNumber": req.body.contactNumber,
            "date": req.body.date
        })
    }
}

const deleteAppointment = (req, res) => {
    // rewrite logic
    if (!req.body.name || !req.body.contactNumber || !req.body.date) {
        res.status(400).json({ 'message': 'Name,, Contact number and Date are required' });
    }

    const appointmentExists = data.appointments.find(appoint => appoint.date == req.body.date)

    if (appointmentExists) {

        data.setAppointments([...data.appointments.filter(appoint => appoint.date != req.body.date)])
        res.json({
            "message": "Appointment for the date deleted"
        })
    } else {
        res.status(400).json({ 'message': 'Appointment for the date does not exists' });
    }
}

const getAppointment = (req, res) => {
    const appointmentExists = data.appointments.find(appoint => appoint.date == req.params.id)

    if (appointmentExists) {
        res.json(appointmentExists);
    } else {
        res.status(400).json({ 'message': 'Appointment not available for the date' });
    }
}

module.exports = {
    getAllAppointments,
    createNewAppointment,
    updateAppointment,
    deleteAppointment,
    getAppointment
}