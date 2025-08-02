import nodemailer from 'nodemailer';

// Configuración para Mailtrap (ideal para desarrollo)
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "e9620d5eca0c25", // Reemplaza con tu usuario de Mailtrap
        pass: "1609a8a840744a" // Reemplaza con tu contraseña de Mailtrap
    }
});

// Configuración alternativa para Gmail (si prefieres)
/*
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'tuemail@gmail.com',
        pass: 'tucontraseña' // O usa una contraseña de aplicación
    }
});
*/

export const sendWelcomeEmail = async (email, nombreUsuario) => {
    try {
        const mailOptions = {
            from: '"Nutrición Concierge" <no-reply@nutritionconcierge.shop>',
            to: email,
            subject: 'Bienvenido a Nutrición Concierge',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0;">
                    <h1 style="color: #2d9a5b; text-align: center;">Bienvenido a Nutrición Concierge!</h1>
                    
                    <p>Estimado/a ${email},</p>
                    
                    <p>Nos complace darte la bienvenida a nuestro servicio de nutrición personalizada. Estamos comprometidos a acompañarte en tu camino hacia una vida más saludable y equilibrada.</p>
                    
                    <p>Como miembro de Nutrición Concierge, ahora tienes acceso a:</p>
                    <ul>
                        <li>Planes de alimentación personalizados</li>
                        <li>Seguimiento nutricional continuo</li>
                        <li>Recursos exclusivos para tu bienestar</li>
                        <li>Soporte profesional cuando lo necesites</li>
                    </ul>
                    
                    <div style="background-color: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px;">
                        <h3 style="margin-top: 0;">Acceder a mi cuenta</h3>
                        <p><strong>Tus credenciales de acceso</strong></p>
                        <p>URL: <a href="http://localhost:3000/login">http://localhost:3000/login</a></p>
                        <p>Usuario: ${nombreUsuario}</p>
                    </div>
                    
                    <p><strong>¿Cómo comenzar?</strong></p>
                    <ol>
                        <li>Inicia sesión con tus credenciales</li>
                        <li>Completa tu perfil de salud</li>
                        <li>Revisa las recomendaciones iniciales</li>
                        <li>Programa tu primera consulta (si aplica)</li>
                    </ol>
                    
                    <p>Si necesitas ayuda, contáctanos en <a href="mailto:soporte@nutritionconcierge.shop">soporte@nutritionconcierge.shop</a></p>
                    
                    <p style="margin-top: 30px; font-size: 0.9em; color: #666;">
                        Atentamente,<br>
                        El equipo de Nutrición Concierge<br>
                        <em>Este es un mensaje automático. Por favor no respondas directamente a este correo.</em>
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`Correo de bienvenida enviado a ${email}`);
    } catch (error) {
        console.error('Error al enviar el correo de bienvenida:', error);
        // No lanzamos el error para no interrumpir el flujo de registro
    }
};
