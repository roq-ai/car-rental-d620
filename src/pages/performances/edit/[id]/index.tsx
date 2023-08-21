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
import { FunctionComponent, useState, useRef } from 'react';
import * as yup from 'yup';
import useSWR from 'swr';
import { AccessOperationEnum, AccessServiceEnum, requireNextAuth, withAuthorization } from '@roq/nextjs';
import { compose } from 'lib/compose';
import { ImagePicker } from 'components/image-file-picker';
import { getPerformanceById, updatePerformanceById } from 'apiSdk/performances';
import { performanceValidationSchema } from 'validationSchema/performances';
import { PerformanceInterface } from 'interfaces/performance';
import { VehicleInterface } from 'interfaces/vehicle';
import { getVehicles } from 'apiSdk/vehicles';

function PerformanceEditPage() {
  const router = useRouter();
  const id = router.query.id as string;

  const { data, error, isLoading, mutate } = useSWR<PerformanceInterface>(
    () => (id ? `/performances/${id}` : null),
    () => getPerformanceById(id),
  );
  const [formError, setFormError] = useState(null);

  const handleSubmit = async (values: PerformanceInterface, { resetForm }: FormikHelpers<any>) => {
    setFormError(null);
    try {
      const updated = await updatePerformanceById(id, values);
      mutate(updated);
      resetForm();
      router.push('/performances');
    } catch (error: any) {
      if (error?.response.status === 403) {
        setFormError({ message: "You don't have permisisons to update this resource" });
      } else {
        setFormError(error);
      }
    }
  };

  const formik = useFormik<PerformanceInterface>({
    initialValues: data,
    validationSchema: performanceValidationSchema,
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
              label: 'Performances',
              link: '/performances',
            },
            {
              label: 'Update Performance',
              isCurrent: true,
            },
          ]}
        />
      }
    >
      <Box rounded="md">
        <Box mb={4}>
          <Text as="h1" fontSize={{ base: '1.5rem', md: '1.875rem' }} fontWeight="bold" color="base.content">
            Update Performance
          </Text>
        </Box>
        {(error || formError) && (
          <Box mb={4}>
            <Error error={error || formError} />
          </Box>
        )}

        <FormWrapper onSubmit={formik.handleSubmit}>
          <NumberInput
            label="Average Speed"
            formControlProps={{
              id: 'average_speed',
              isInvalid: !!formik.errors?.average_speed,
            }}
            name="average_speed"
            error={formik.errors?.average_speed}
            value={formik.values?.average_speed}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('average_speed', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Total Distance"
            formControlProps={{
              id: 'total_distance',
              isInvalid: !!formik.errors?.total_distance,
            }}
            name="total_distance"
            error={formik.errors?.total_distance}
            value={formik.values?.total_distance}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('total_distance', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Total Time"
            formControlProps={{
              id: 'total_time',
              isInvalid: !!formik.errors?.total_time,
            }}
            name="total_time"
            error={formik.errors?.total_time}
            value={formik.values?.total_time}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('total_time', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Total Reservations"
            formControlProps={{
              id: 'total_reservations',
              isInvalid: !!formik.errors?.total_reservations,
            }}
            name="total_reservations"
            error={formik.errors?.total_reservations}
            value={formik.values?.total_reservations}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('total_reservations', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <NumberInput
            label="Usage Frequency"
            formControlProps={{
              id: 'usage_frequency',
              isInvalid: !!formik.errors?.usage_frequency,
            }}
            name="usage_frequency"
            error={formik.errors?.usage_frequency}
            value={formik.values?.usage_frequency}
            onChange={(valueString, valueNumber) =>
              formik.setFieldValue('usage_frequency', Number.isNaN(valueNumber) ? 0 : valueNumber)
            }
          />

          <AsyncSelect<VehicleInterface>
            formik={formik}
            name={'vehicle_id'}
            label={'Select Vehicle'}
            placeholder={'Select Vehicle'}
            fetcher={getVehicles}
            labelField={'make'}
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
              onClick={() => router.push('/performances')}
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
    entity: 'performance',
    operation: AccessOperationEnum.UPDATE,
  }),
)(PerformanceEditPage);
