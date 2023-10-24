import {
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  Box,
  Spinner,
  FormErrorMessage,
  Switch,
  Flex,
} from '@chakra-ui/react';
import Breadcrumbs from 'components/breadcrumb';
import DatePicker from 'components/date-picker';
import { Error } from 'components/error';
import { FormWrapper } from 'components/form-wrapper';
import { NumberInput } from 'components/number-input';
import { SelectInput } from 'components/select-input';
import { AsyncSelect } from 'components/async-select';
import { TextInput } from 'components/text-input';
import AppLayout from 'layout/app-layout';
import { FormikHelpers, useFormik } from 'formik';
import { useRouter } from 'next/router';
import { FunctionComponent, useState } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { useRoqClient } from 'lib/roq';
import * as RoqTypes from 'lib/roq/types';

import { appointmentValidationSchema } from 'validationSchema/appointments';
import { PatientInterface } from 'interfaces/patient';
import { DoctorInterface } from 'interfaces/doctor';
import { NurseInterface } from 'interfaces/nurse';
import { HospitalInterface } from 'interfaces/hospital';
import { AppointmentInterface } from 'interfaces/appointment';

function AppointmentCreatePage() {
  const router = useRouter();
  const [error, setError] = useState(null);
  const roqClient = useRoqClient();
  const handleSubmit = async (values: AppointmentInterface, { resetForm }: FormikHelpers<any>) => {
    setError(null);
    try {
      await roqClient.appointment.create({ data: values as RoqTypes.appointment });
      resetForm();
      router.push('/appointments');
    } catch (error) {
      setError(error);
    }
  };

  const formik = useFormik<AppointmentInterface>({
    initialValues: {
      appointment_date: new Date(new Date().toDateString()),
      appointment_time: '',
      patient_id: (router.query.patient_id as string) ?? null,
      doctor_id: (router.query.doctor_id as string) ?? null,
      nurse_id: (router.query.nurse_id as string) ?? null,
      hospital_id: (router.query.hospital_id as string) ?? null,
    },
    validationSchema: appointmentValidationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
  });

  return (
    <AppLayout
      breadcrumbs={
        <Breadcrumbs
          items={[
            {
              label: 'Appointments',
              link: '/appointments',
            },
            {
              label: 'Create Appointment',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Create Appointment
          </Text>
        </Box>
        {error && (
          <Box mb={4}>
            <Error error={error} />
          </Box>
        )}
        <FormWrapper onSubmit={formik.handleSubmit}>
          <FormControl id="appointment_date" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Appointment Date
            </FormLabel>
            <DatePicker
              selected={formik.values?.appointment_date ? new Date(formik.values?.appointment_date) : null}
              onChange={(value: Date) => formik.setFieldValue('appointment_date', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.appointment_time}
            label={'Appointment Time'}
            props={{
              name: 'appointment_time',
              placeholder: 'Appointment Time',
              value: formik.values?.appointment_time,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<PatientInterface>
            formik={formik}
            name={'patient_id'}
            label={'Select Patient'}
            placeholder={'Select Patient'}
            fetcher={() => roqClient.patient.findManyWithCount({})}
            labelField={'first_name'}
          />
          <AsyncSelect<DoctorInterface>
            formik={formik}
            name={'doctor_id'}
            label={'Select Doctor'}
            placeholder={'Select Doctor'}
            fetcher={() => roqClient.doctor.findManyWithCount({})}
            labelField={'first_name'}
          />
          <AsyncSelect<NurseInterface>
            formik={formik}
            name={'nurse_id'}
            label={'Select Nurse'}
            placeholder={'Select Nurse'}
            fetcher={() => roqClient.nurse.findManyWithCount({})}
            labelField={'first_name'}
          />
          <AsyncSelect<HospitalInterface>
            formik={formik}
            name={'hospital_id'}
            label={'Select Hospital'}
            placeholder={'Select Hospital'}
            fetcher={() => roqClient.hospital.findManyWithCount({})}
            labelField={'name'}
          />
          <Flex justifyContent={'flex-start'}>
            <Button
              isDisabled={formik?.isSubmitting}
              bg="state.info.main"
              color="base.100"
              type="submit"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              _hover={{
                bg: 'state.info.main',
                color: 'base.100',
              }}
            >
              Submit
            </Button>
            <Button
              bg="neutral.transparent"
              color="neutral.main"
              type="button"
              display="flex"
              height="2.5rem"
              padding="0rem 1rem"
              justifyContent="center"
              alignItems="center"
              gap="0.5rem"
              mr="4"
              onClick={() => router.push('/appointments')}
              _hover={{
                bg: 'neutral.transparent',
                color: 'neutral.main',
              }}
            >
              Cancel
            </Button>
          </Flex>
        </FormWrapper>
      </Box>
    </AppLayout>
  );
}

export default compose(
  requireNextAuth({
    redirectTo: '/',
  }),
  withAuthorization({
    service: AccessServiceEnum.PROJECT,
    entity: 'appointment',
    operation: AccessOperationEnum.CREATE,
  }),
)(AppointmentCreatePage);
