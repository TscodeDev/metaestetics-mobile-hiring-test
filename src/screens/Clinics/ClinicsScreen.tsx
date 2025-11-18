import React, { useCallback, useMemo, useState } from 'react';
import { View, FlatList, StyleSheet, ListRenderItem } from 'react-native';
import { Card, Typography, Input, LoadingSpinner } from '@components/common';
import { colors, spacing } from '@theme';
import { Clinic } from '@types';
import { useClinicData } from '@hooks/useClinicData';

const ClinicItem = React.memo(({ clinic }: { clinic: Clinic }) => (
  <Card style={styles.clinicCard}>
    <Typography variant="h4">{clinic.name}</Typography>
    <Typography variant="body2">{clinic.address}</Typography>
    <Typography variant="body2">Rating: {clinic.rating.toFixed(1)}</Typography>
  </Card>
));

export const ClinicsScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useDebouncedValue(searchQuery, 300);
  const { data, loading, error, refetch } = useClinicData(debouncedSearch);

  const clinics = data ?? [];

  const keyExtractor = useCallback((item: Clinic) => item.id, []);

  const renderClinic: ListRenderItem<Clinic> = useCallback(
    ({ item }) => <ClinicItem clinic={item} />,
    []
  );

  const listEmptyComponent = useMemo(
    () =>
      !loading ? (
        <Typography variant="body2" style={styles.emptyText}>
          {debouncedSearch ? 'No clinics match your search.' : 'No clinics available.'}
        </Typography>
      ) : null,
    [loading, debouncedSearch]
  );

  if (loading && clinics.length === 0) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <View style={styles.container}>
      <Input
        placeholder="Search clinics..."
        value={searchQuery}
        onChangeText={setSearchQuery}
        style={styles.searchInput}
      />

      {error && (
        <Typography variant="caption" style={styles.errorText}>
          {error}
        </Typography>
      )}

      <FlatList
        data={clinics}
        renderItem={renderClinic}
        keyExtractor={keyExtractor}
        ListEmptyComponent={listEmptyComponent}
        contentContainerStyle={clinics.length === 0 ? styles.emptyContainer : undefined}
        initialNumToRender={12}
        windowSize={5}
        maxToRenderPerBatch={12}
        removeClippedSubviews
        refreshing={loading}
        onRefresh={refetch}
      />
    </View>
  );
};

function useDebouncedValue<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = React.useState<T>(value);

  React.useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.md,
  },
  searchInput: {
    marginBottom: spacing.md,
  },
  clinicCard: {
    marginBottom: spacing.sm,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: colors.textSecondary,
  },
  errorText: {
    color: colors.error,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
});

