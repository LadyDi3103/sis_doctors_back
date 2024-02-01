const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const RoutesAuthentication = require('./routes/Authentication.routes');
const RoutesCitas = require('./routes/Appointments.routes');
const RoutesMedicos = require('./routes/Doctors.routes');
const RoutesPacientes = require('./routes/Patients.routes');
const { authToken } = require('./middlewares/AuthToken.middleware');
app.use(cors());
app.use(express.json());

app.use('/auth', RoutesAuthentication);
app.use('/citas', authToken, RoutesCitas);
app.use('/medicos', authToken, RoutesMedicos);
app.use('/pacientes', authToken, RoutesPacientes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
