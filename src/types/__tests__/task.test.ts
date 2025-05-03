import { describe, it, expect } from 'vitest';
import { ETaskPriority, isValidTaskPriority, compareTaskPriority, getHighestPriority } from '../task';
import { ETaskRecurrence, isValidTaskRecurrence, compareTaskRecurrence, getNextRecurrenceDate } from '../task';

describe('ETaskPriority', () => {
  it('deve ter os níveis de prioridade corretos', () => {
    expect(ETaskPriority.LOW).toBe('low');
    expect(ETaskPriority.MEDIUM).toBe('medium');
    expect(ETaskPriority.HIGH).toBe('high');
    expect(ETaskPriority.URGENT).toBe('urgent');
  });

  it('deve ter todos os valores como strings', () => {
    Object.values(ETaskPriority).forEach(value => {
      expect(typeof value).toBe('string');
    });
  });

  it('deve ter valores únicos', () => {
    const values = Object.values(ETaskPriority);
    const uniqueValues = new Set(values);
    expect(values.length).toBe(uniqueValues.size);
  });

  it('deve ter valores em ordem crescente de prioridade', () => {
    const values = Object.values(ETaskPriority);
    const expectedOrder = ['low', 'medium', 'high', 'urgent'];
    expect(values).toEqual(expectedOrder);
  });

  describe('isValidTaskPriority', () => {
    it('deve validar níveis de prioridade corretamente', () => {
      expect(isValidTaskPriority('low')).toBe(true);
      expect(isValidTaskPriority('medium')).toBe(true);
      expect(isValidTaskPriority('high')).toBe(true);
      expect(isValidTaskPriority('urgent')).toBe(true);
      expect(isValidTaskPriority('invalid')).toBe(false);
      expect(isValidTaskPriority(123)).toBe(false);
      expect(isValidTaskPriority(null)).toBe(false);
      expect(isValidTaskPriority(undefined)).toBe(false);
    });
  });

  describe('compareTaskPriority', () => {
    it('deve comparar níveis de prioridade corretamente', () => {
      expect(compareTaskPriority(ETaskPriority.LOW, ETaskPriority.LOW)).toBe(0);
      expect(compareTaskPriority(ETaskPriority.LOW, ETaskPriority.MEDIUM)).toBeLessThan(0);
      expect(compareTaskPriority(ETaskPriority.MEDIUM, ETaskPriority.LOW)).toBeGreaterThan(0);
      expect(compareTaskPriority(ETaskPriority.URGENT, ETaskPriority.LOW)).toBeGreaterThan(0);
    });
  });

  describe('getHighestPriority', () => {
    it('deve retornar o nível de prioridade mais alto', () => {
      expect(getHighestPriority(ETaskPriority.LOW, ETaskPriority.MEDIUM)).toBe(ETaskPriority.MEDIUM);
      expect(getHighestPriority(ETaskPriority.HIGH, ETaskPriority.MEDIUM)).toBe(ETaskPriority.HIGH);
      expect(getHighestPriority(ETaskPriority.URGENT, ETaskPriority.HIGH)).toBe(ETaskPriority.URGENT);
      expect(getHighestPriority(ETaskPriority.LOW, ETaskPriority.LOW)).toBe(ETaskPriority.LOW);
    });
  });
});

describe('ETaskRecurrence', () => {
  it('deve ter os tipos de recorrência corretos', () => {
    expect(ETaskRecurrence.NONE).toBe('none');
    expect(ETaskRecurrence.DAILY).toBe('daily');
    expect(ETaskRecurrence.WEEKLY).toBe('weekly');
    expect(ETaskRecurrence.MONTHLY).toBe('monthly');
    expect(ETaskRecurrence.YEARLY).toBe('yearly');
  });

  it('deve ter todos os valores como strings', () => {
    Object.values(ETaskRecurrence).forEach(value => {
      expect(typeof value).toBe('string');
    });
  });

  it('deve ter valores únicos', () => {
    const values = Object.values(ETaskRecurrence);
    const uniqueValues = new Set(values);
    expect(values.length).toBe(uniqueValues.size);
  });

  it('deve ter valores em ordem crescente de frequência', () => {
    const values = Object.values(ETaskRecurrence);
    const expectedOrder = ['none', 'daily', 'weekly', 'monthly', 'yearly'];
    expect(values).toEqual(expectedOrder);
  });

  describe('isValidTaskRecurrence', () => {
    it('deve validar tipos de recorrência corretamente', () => {
      expect(isValidTaskRecurrence('none')).toBe(true);
      expect(isValidTaskRecurrence('daily')).toBe(true);
      expect(isValidTaskRecurrence('weekly')).toBe(true);
      expect(isValidTaskRecurrence('monthly')).toBe(true);
      expect(isValidTaskRecurrence('yearly')).toBe(true);
      expect(isValidTaskRecurrence('invalid')).toBe(false);
      expect(isValidTaskRecurrence(123)).toBe(false);
      expect(isValidTaskRecurrence(null)).toBe(false);
      expect(isValidTaskRecurrence(undefined)).toBe(false);
    });
  });

  describe('compareTaskRecurrence', () => {
    it('deve comparar tipos de recorrência corretamente', () => {
      expect(compareTaskRecurrence(ETaskRecurrence.NONE, ETaskRecurrence.NONE)).toBe(0);
      expect(compareTaskRecurrence(ETaskRecurrence.NONE, ETaskRecurrence.DAILY)).toBeLessThan(0);
      expect(compareTaskRecurrence(ETaskRecurrence.DAILY, ETaskRecurrence.NONE)).toBeGreaterThan(0);
      expect(compareTaskRecurrence(ETaskRecurrence.YEARLY, ETaskRecurrence.NONE)).toBeGreaterThan(0);
    });
  });

  describe('getNextRecurrenceDate', () => {
    it('deve calcular a próxima data de recorrência corretamente', () => {
      const baseDate = new Date('2024-01-01');
      
      expect(getNextRecurrenceDate(baseDate, ETaskRecurrence.DAILY, 1))
        .toEqual(new Date('2024-01-02'));
      
      expect(getNextRecurrenceDate(baseDate, ETaskRecurrence.WEEKLY, 1))
        .toEqual(new Date('2024-01-08'));
      
      expect(getNextRecurrenceDate(baseDate, ETaskRecurrence.MONTHLY, 1))
        .toEqual(new Date('2024-02-01'));
      
      expect(getNextRecurrenceDate(baseDate, ETaskRecurrence.YEARLY, 1))
        .toEqual(new Date('2025-01-01'));
      
      expect(getNextRecurrenceDate(baseDate, ETaskRecurrence.DAILY, 2))
        .toEqual(new Date('2024-01-03'));
    });
  });
}); 