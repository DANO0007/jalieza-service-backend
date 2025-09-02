import { BadRequestException } from '@nestjs/common';

export const validateBirthDate = (birthDate: Date): Date => {
  if (!birthDate) return null;

  const localDate = new Date(birthDate);

  // Validar que la fecha sea válida
  if (isNaN(localDate.getTime())) {
    throw new BadRequestException('Fecha de nacimiento inválida');
  }

  // ✅ CORRECCIÓN IMPORTANTE: Ajuste para desfase de zona horaria
  localDate.setMinutes(
    localDate.getMinutes() + localDate.getTimezoneOffset(),
  );

  // Validar que no sea una fecha futura
  if (localDate > new Date()) {
    throw new BadRequestException('La fecha de nacimiento no puede ser futura');
  }

  // Validar que no sea una fecha muy antigua (más de 150 años)
  const minDate = new Date();
  minDate.setFullYear(minDate.getFullYear() - 150);
  if (localDate < minDate) {
    throw new BadRequestException(
      'La fecha de nacimiento no puede ser anterior a 150 años',
    );
  }

  // Normalizar a solo fecha (sin hora, minutos, segundos)
  const normalizedDate = new Date(
    localDate.getFullYear(),
    localDate.getMonth(),
    localDate.getDate(),
  );

  return normalizedDate;
};

export const formatDateOnly = (date: Date | string | null): string | null => {
  if (!date) return null;

  // Convertir string a Date si es necesario
  let dateObj: Date;
  if (typeof date === 'string') {
    dateObj = new Date(date);
    if (isNaN(dateObj.getTime())) {
      return null;
    }
  } else {
    dateObj = date;
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};

// ✅ CALCULAR EDAD
export const calculateAge = (
  birthDate: Date | string | null,
): number | null => {
  if (!birthDate) return null;

  // Convertir string a Date si es necesario
  let birth: Date;
  if (typeof birthDate === 'string') {
    birth = new Date(birthDate);
    if (isNaN(birth.getTime())) {
      return null; // Fecha inválida
    }
  } else {
    birth = birthDate;
  }

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();

  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
};
