export class LaporanMutations {
  public static downloadPDF(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}
