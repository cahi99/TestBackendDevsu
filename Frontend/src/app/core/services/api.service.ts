import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export const API_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  // --- Clientes ---
  getClientes(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/clientes`);
  }
  
  createCliente(data: any): Observable<any> {
    return this.http.post(`${API_URL}/clientes`, data);
  }

  updateCliente(id: number, data: any): Observable<any> {
    return this.http.put(`${API_URL}/clientes/${id}`, data);
  }

  deleteCliente(id: number): Observable<void> {
    return this.http.delete<void>(`${API_URL}/clientes/${id}`);
  }

  // --- Cuentas ---
  getCuentas(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/cuentas`);
  }

  createCuenta(data: any): Observable<any> {
    return this.http.post(`${API_URL}/cuentas`, data);
  }

  updateCuenta(numero: string, data: any): Observable<any> {
    return this.http.patch(`${API_URL}/cuentas/${numero}`, data);
  }

  deleteCuenta(numero: string): Observable<void> {
    return this.http.delete<void>(`${API_URL}/cuentas/${numero}`);
  }

  // --- Movimientos ---
  getMovimientos(): Observable<any[]> {
    return this.http.get<any[]>(`${API_URL}/movimientos`);
  }

  createMovimiento(data: any): Observable<any> {
    return this.http.post(`${API_URL}/movimientos`, data);
  }

  // --- Reportes ---
  getReportes(inicio: string, fin: string, clienteId: number): Observable<any> {
    return this.http.get<any>(`${API_URL}/reportes?fechaInicio=${inicio}&fechaFin=${fin}&clienteId=${clienteId}`);
  }

  getReportePdf(inicio: string, fin: string, clienteId: number): Observable<{ base64: string }> {
    // Assuming backend returns { base64: "JVBERi0xLjQK..." } when requested for PDF
    // or maybe the string directly. If it returns the raw string, the typing should be string.
    return this.http.get<{ base64: string }>(`${API_URL}/reportes?fechaInicio=${inicio}&fechaFin=${fin}&clienteId=${clienteId}&format=pdf`);
  }
}
