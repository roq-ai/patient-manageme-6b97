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
  Center,
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
import { FunctionComponent, useState, useRef, useMemo } from 'react';
import * as yup from 'yup';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { useRoqClient, usePatientFindFirst } from 'lib/roq';
import * as RoqTypes from 'lib/roq/types';
import { convertQueryToPrismaUtil } from 'lib/utils';
import { patientValidationSchema } from 'validationSchema/patients';
import { PatientInterface } from 'interfaces/patient';
import { UserInterface } from 'interfaces/user';

function PatientEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const roqClient = useRoqClient();
  const queryParams = useMemo(
    () =>
      convertQueryToPrismaUtil(
        {
          id,
        },
        'patient',
      ),
    [id],
  );
  const { data, error, isLoading, mutate } = usePatientFindFirst(queryParams, {}, { disabled: !id });
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PatientInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await roqClient.patient.update({
        data: values as RoqTypes.patient,
        where: {
          id,
        },
      });
      mutate(updated);
      resetForm();
      router.push('/patients');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<PatientInterface>({
    initialValues: data,
    validationSchema: patientValidationSchema,
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
              label: 'Patients',
              link: '/patients',
            },
            {
              label: 'Update Patient',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Patient
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <TextInput
            error={formik.errors.first_name}
            label={'First Name'}
            props={{
              name: 'first_name',
              placeholder: 'First Name',
              value: formik.values?.first_name,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.last_name}
            label={'Last Name'}
            props={{
              name: 'last_name',
              placeholder: 'Last Name',
              value: formik.values?.last_name,
              onChange: formik.handleChange,
            }}
          />

          <FormControl id="dob" mb="4">
            <FormLabel fontSize="1rem" fontWeight={600}>
              Dob
            </FormLabel>
            <DatePicker
              selected={formik.values?.dob ? new Date(formik.values?.dob) : null}
              onChange={(value: Date) => formik.setFieldValue('dob', value)}
            />
          </FormControl>

          <TextInput
            error={formik.errors.gender}
            label={'Gender'}
            props={{
              name: 'gender',
              placeholder: 'Gender',
              value: formik.values?.gender,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.contact_number}
            label={'Contact Number'}
            props={{
              name: 'contact_number',
              placeholder: 'Contact Number',
              value: formik.values?.contact_number,
              onChange: formik.handleChange,
            }}
          />

          <TextInput
            error={formik.errors.address}
            label={'Address'}
            props={{
              name: 'address',
              placeholder: 'Address',
              value: formik.values?.address,
              onChange: formik.handleChange,
            }}
          />

          <AsyncSelect<UserInterface>
            formik={formik}
            name={'user_id'}
            label={'Select User'}
            placeholder={'Select User'}
            fetcher={() => roqClient.user.findManyWithCount({})}
            labelField={'email'}
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
              onClick={() => router.push('/patients')}
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
    entity: 'patient',
    operation: AccessOperationEnum.UPDATE,
  }),
)(PatientEditPage);
