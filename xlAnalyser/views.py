from django.shortcuts import render
import pandas as pd 
from io import BytesIO
from django.http import HttpResponse


def index(request):
    return render(request, "index.html")


def analyse(request):

    response = None

    # try:

    file = request.FILES['xlfile']

    # Read the file
    df = pd.read_excel(file)

    # Analysis of the file
    df.drop(['Date', 'ACCNO'], axis=1, inplace=True)
    df['Cust Pin'] = df['Cust Pin'].astype(str)
    df['DPD'] = df['DPD'].astype(int)
    new_df = df.groupby(by=['Cust State', 'Cust Pin'], as_index=False).sum()
    new_df = new_df.sort_values(by='DPD', ascending=False)
    new_df = new_df.reset_index(drop=True)

    # Return the analysis
    buffer = BytesIO()
    with pd.ExcelWriter(buffer, engine='xlsxwriter') as writer:
        new_df.to_excel(writer, index=True)

    buffer.seek(0)

    # Set up the HttpResponse to return the Excel file
    response = HttpResponse(
        buffer,
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename="analyzed_data.xlsx"'

    # except Exception as e:
    #     print(e)
    #     response = HttpResponse("Error processing the file", status=500)

    return response 
